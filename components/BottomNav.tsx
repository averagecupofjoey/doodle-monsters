import { HiHome, HiSearch } from 'react-icons/hi';
import { IoCreateSharp } from 'react-icons/io5';
import Link from 'next/link';

export default function BottomNav() {
  return (
    <div className='bottomNav'>
      <div className='bottomButton'>
        <Link href='/'>
          <>
            <HiHome />
            Home
          </>
        </Link>
      </div>
      <div className='bottomButton'>
        <HiSearch />
        Search
      </div>
      <div className='bottomButton'>
        <Link href='/create'>
          <>
            <IoCreateSharp />
            Create
          </>
        </Link>
      </div>
    </div>
  );
}
