import { Grid } from '@mantine/core';
import { HiHome, HiSearch } from 'react-icons/hi';
import { IoCreateSharp } from 'react-icons/io5';
import Link from 'next/link';

export default function FooterMenu() {
  return (
    <Grid gutter={0} className='footerMenu'>
      <Grid.Col span={4} className='footerGrid'>
        <Link href='/'>
          <a>
            <HiHome />
          </a>
        </Link>
        Home
      </Grid.Col>
      <Grid.Col span={4} className='footerGrid'>
        <Link href='/login'>
          <a>
            <HiSearch />
          </a>
        </Link>
        Search
      </Grid.Col>
      <Grid.Col span={4} className='footerGrid'>
        <Link href='/create'>
          <a>
            <IoCreateSharp />
          </a>
        </Link>
        Create
      </Grid.Col>
    </Grid>
  );
}
