import type { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../../lib/mongodb';
import { Customer } from '../../customers/index';
import { ObjectId } from 'mongodb';

type Return = {
  customers: Customer[];
};

export const getCustomers = async (): Promise<Customer[]> => {
  const mongoClient = await clientPromise;

  const data = (await mongoClient
    .db()
    .collection('customers')
    .find()
    .toArray()) as Customer[];

  return JSON.parse(JSON.stringify(data));
};

export const addCustomer = async (customer: Customer): Promise<ObjectId> => {
  const mongoClient = await clientPromise;

  const response = await mongoClient
    .db()
    .collection('customers')
    .insertOne({ customer });

  return response.insertedId;
};

// eslint-disable-next-line import/no-anonymous-default-export
export default async (
  req: NextApiRequest,
  res: NextApiResponse<Return | ObjectId | { error: string }>
) => {
  if (req.method === 'GET') {
    const data = await getCustomers();
    res.status(200).json({ customers: data });
  } else if (req.method === 'POST') {
    if (req.body.name && req.body.industry) {
      const customer: Customer = {
        name: req.body.name,
        industry: req.body.industry,
      };

      const insertedId = await addCustomer(customer);
     res.revalidate('/customers')
     res.revalidate('/customers/' + insertedId)
      res.status(200).json(insertedId);
    } else {
      res.status(400).json({ error: 'name and industry are required.' });
    }
  }
};
