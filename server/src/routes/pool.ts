import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import {authenticate} from "../plugins/authenticate";

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get('/pools/count', async () => {
    const count = await prisma.pool.count();

    return {count}
  })

  //Criar um bolão
  fastify.post('/pools', async (request, reply) => {
    const createPoolBody = z.object({
      title: z.string()
    });

    const { title } = createPoolBody.parse(request.body);

    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    try {
      await request.jwtVerify();

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: request.user.sub,

          participants: {
            create: {
              userId: request.user.sub
            }
          }
        }
      });

    } catch {
      //Na versão web não é criado o dono do bolão
      await prisma.pool.create({
        data: {
          title,
          code
        }
      });
    }


    return reply.code(201).send({ code });
  })

  //Entrar em um bolão
  fastify.post('/pools/join', {onRequest: [authenticate]}, async (request, reply) => {
    const joinPoolBody = z.object({
      code: z.string()
    });

    const { code } = joinPoolBody.parse(request.body);

    const pool = await prisma.pool.findUnique({
      where: {
        code
      },
      include: {
        participants: {
          where: {
            userId: request.user.sub
          }
        }
      }
    });

    //Se não houver bolão
    if(!pool) {
      return reply.status(400).send({
        message: "Pool not found."
      });
    }

    //Caso pool.participants onde o userId seja igual ao sub
    if(pool.participants.length > 0) {
      return reply.status(400).send({
        message: "You already joined this pool."
      });
    }

    //Se o bolão não tiver dono, (bolões criados com a versão web não possuem donos)
    if(!pool.ownerId) {
      await prisma.pool.update({
        where: {
          id: pool.id
        },
        data: {
          ownerId: request.user.sub
        }
      });
    }

    //Cria participante
    await prisma.participant.create({
      data: {
        poolId: pool.id,
        userId: request.user.sub
      }
    });

    return reply.status(201).send();
  })

  //Bolões em que o usuário está participando com detalhes
  fastify.get('/pools', {onRequest: [authenticate]}, async (request, reply) => {
    const pools = await prisma.pool.findMany({
      where: {
        participants: {
          some: {
            userId: request.user.sub
          }
        }
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        },
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return {pools}
  });

  //Mostra detalhes do bolão
  fastify.get('/pools/:id', {onRequest: [authenticate]}, async (request, reply) => {
    const getPoolParams = z.object({
      id: z.string()
    });

    const { id } = getPoolParams.parse(request.params); //pega dados do url

    const pool = await prisma.pool.findUnique({
      where: {
        id
      },
      include: {
        _count: {
          select: {
            participants: true
          }
        },
        participants: {
          select: {
            id: true,

            user: {
              select: {
                avatarUrl: true
              }
            }
          },
          take: 4
        },
        owner: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return {pool}
  });
}