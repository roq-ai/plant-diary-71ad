import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { taskValidationSchema } from 'validationSchema/tasks';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.task
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getTaskById();
    case 'PUT':
      return updateTaskById();
    case 'DELETE':
      return deleteTaskById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getTaskById() {
    const data = await prisma.task.findFirst(convertQueryToPrismaUtil(req.query, 'task'));
    return res.status(200).json(data);
  }

  async function updateTaskById() {
    await taskValidationSchema.validate(req.body);
    const data = await prisma.task.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteTaskById() {
    const data = await prisma.task.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
