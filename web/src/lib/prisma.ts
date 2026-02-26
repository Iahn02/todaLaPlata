import { auth, currentUser } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// Instancia global de Prisma para evitar que se abran múltiples conexiones en desarrollo (Next.js hot reload)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
    const adapter = new PrismaBetterSqlite3({ url: "file:prisma/dev.db" });
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma || createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * getCurrentUser:
 * Valida la sesión actual en Clerk y verifica que el usuario exista en nuestra base de datos.
 * Funciona como middleware interno para todas nuestras páginas y acciones seguras.
 */
export const getCurrentUser = async () => {
    try {
        const { userId } = await auth();

        // 1. Si Clerk nos dice que no hay sesión, abortamos y retornamos nulo
        if (!userId) {
            return null;
        }

        // Pedimos a Clerk los datos extra visuales del usuario (nombre, foto, emails)
        const user = await currentUser();
        if (!user) {
            return null;
        }

        // 2. Revisamos si en nuestra base de datos SQLITE existe este userId de Clerk
        let dbUser = await prisma.user.findUnique({
            where: {
                id: user.id, // Usamos el mismo ID exacto que le asignó Clerk (cuid)
            }
        });

        // 3. SI NO EXISTE: Es un registro nuevo. Inyectamos a este usuario a la Base de Datos.
        if (!dbUser) {
            // Intentamos conseguir el correo principal de la lista de correos de Clerk
            const email = user.emailAddresses[0]?.emailAddress ?? "sin_email@usuario.com";
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Usuario';

            dbUser = await prisma.user.create({
                data: {
                    id: user.id,      // Usamos el ID de Clerk como PK para conectar ambas bases
                    email: email,
                    name: name,
                    avatarUrl: user.imageUrl,
                    currency: "CLP",  // Configuramos pesos chilenos por defecto
                }
            });
        }

        // 4. Retornamos al Usuario extraído/creado desde nuestra propia base de datos
        return dbUser;

    } catch (error) {
        console.error("Error validando el usuario en Base de Datos:", error);
        return null;
    }
};
