import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      avatarUrl: 'https://github.com/renantrs.png'
    }
  })

  const pool = await prisma.pool.create({
    data: {
      title: 'Example pool',
      code: 'BOL123',
      ownerId: user.id,
      
      participants: {
        create: {
          userId: user.id
        }
      }
    }
  })

  await prisma.game.create({
    data: {
      date: '2022-11-22T17:00:00.000Z',
      firstTeamCountryCode: 'FR',
      secondTeamCountryCode: 'AU'
    }
  })
  await prisma.game.create({
    data: {
      date: '2022-11-23T17:00:00.000Z',
      firstTeamCountryCode: 'BE',
      secondTeamCountryCode: 'CA',
      
      guesses: {
        create: {
          firstTeamPoints: 2,
          secondTeamPoints: 0,

          participant: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id
              }
            }
          }
        }
      }
    }
  })
}

main();