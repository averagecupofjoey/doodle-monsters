import { HiHome, HiSearch } from 'react-icons/hi';
import { IoCreateSharp } from 'react-icons/io5';
import Link from 'next/link';

export default function BottomNav() {
  return (
    <div className='bottomNav'>
      <Link href='/'>
        <a className='bottomButton'>
          <div className='buttonContainer'>
            <HiHome />
            Home
          </div>
        </a>
      </Link>
      <Link href='/search'>
        <a className='bottomButton'>
          <div className='buttonContainer'>
            <HiSearch />
            Search
          </div>
        </a>
      </Link>
      <Link href='/create'>
        <a className='bottomButton'>
          <div className='buttonContainer'>
            <IoCreateSharp />
            Create
          </div>
        </a>
      </Link>
      {/* <div className='bottomButton'>
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
      </div> */}
    </div>
  );
}
