import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { journalValidationSchema } from 'validationSchema/journals';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.journal
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getJournalById();
    case 'PUT':
      return updateJournalById();
    case 'DELETE':
      return deleteJournalById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getJournalById() {
    const data = await prisma.journal.findFirst(convertQueryToPrismaUtil(req.query, 'journal'));
    return res.status(200).json(data);
  }

  async function updateJournalById() {
    await journalValidationSchema.validate(req.body);
    const data = await prisma.journal.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteJournalById() {
    const data = await prisma.journal.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
