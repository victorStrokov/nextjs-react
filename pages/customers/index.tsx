import { NextPage, GetStaticProps, InferGetStaticPropsType } from 'next';
// import axios from 'axios';
import { ObjectId } from 'mongodb';
// import clientPromise from '../../lib/mongodb';
import { getCustomers } from '../api/customers/index';

export type Customer = {
  _id: ObjectId;
  name: string;
  industry: string;
};

export const getStaticProps: GetStaticProps = async () => {
  const data = await getCustomers();

  console.log('!!!!', data);

  // const result = await axios.get<{ customers: Customer[] }>(
  //   'http://127.0.0.1:8000/api/customers/'
  // );
  // типизируем customers: Customer[] так как больше ни где не используем этот тип
  //   console.log(result.data.customers);

  return {
    props: {
      customers: data,
    },
    revalidate: 60, // Кэширование на 60 секунд
  };
};
const Customers: NextPage = ({
  customers,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  //   console.log(customers);

  return (
    <>
      <h1>Customers</h1>
      {customers.map((customer: Customer) => {
        return (
          <div key={customer._id.toString()}>
            <p>{customer._id.toString()}</p>
            <p>{customer.name}</p>
            <p>{customer.industry}</p>
          </div>
        );
      })}
    </>
  );
};

export default Customers;
