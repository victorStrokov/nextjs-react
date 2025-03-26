import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import type { Customer } from './index';
// import { AxiosError } from 'axios';
import { ParsedUrlQuery } from 'querystring';
// import clientPromise from '@/lib/mongodb';
// import { ObjectId } from 'mongodb';
import { BSONError } from 'bson';
import { getCustomer } from '../api/customers/[id]';

type Props = {
  customer?: Customer;
};

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticPaths: GetStaticPaths = async () => {
  //   const result = await axios.get<{ customers: Customer[] }>(
  //     'http://127.0.0.1:8000/api/customers/'
  //   );

  //   const paths = result.data.customers.map((customer: Customer) => {
  //     return { params: { id: customer.id.toString() } };
  //   });

  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<Props, Params> = async (
  context
) => {
  const params = context.params!;

  try {
    const data = await getCustomer(params.id);

    console.log('!!!!', data);

    if (!data) {
      return {
        notFound: true,
        revalidate: 60,
      };
    }

    return {
      props: {
        customer: JSON.parse(JSON.stringify(data)),
      },
      revalidate: 60,
    };
  } catch (err) {
    if (err instanceof BSONError) {
      return {
        notFound: true,
      };
    }
    throw err;
  }
};
// {"conversationId":"c67b8df5-4898-4279-b6b2-0f7a7d7fadc3","source":"instruct"}

const Customer: NextPage<Props> = (props) => {
  const router = useRouter();
  if (router.isFallback) return <div>Loading...</div>;
  return <h1>{props.customer ? 'Customer ' + props.customer.name : null}</h1>;
};

export default Customer;
