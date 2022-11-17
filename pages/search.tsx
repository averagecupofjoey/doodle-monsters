import { Input, Chip, Button } from '@mantine/core';
import Layout from '../components/Layout';
import { useState } from 'react';
import axios from 'axios';
import CardGrid from '../components/CardGrid';
import { getSession, useSession } from 'next-auth/react';

async function search(searchType, searchTerm, session) {
  const response = await axios.get('/api/search', {
    params: { type: searchType, name: searchTerm, session: session.id },
  });
  return response.data;
}

export default function SearchPage() {
  const [searchType, setSearchType] = useState('user');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);

  const { data: session } = useSession();
  return (
    <>
      <Layout>
        <div className='searchContainer'>
          <div className='searchOptions'>
            <Input
              placeholder='Search for a card or user'
              style={{ width: `50%` }}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
            <Chip.Group
              position='center'
              multiple={false}
              value={searchType}
              onChange={setSearchType}
            >
              <Chip value='user'>User Name</Chip>
              <Chip value='card'>Card Name</Chip>
            </Chip.Group>
            <Button
              onClick={async () => {
                let searchResponse = await search(
                  searchType,
                  searchTerm,
                  session
                );
                setSearchResults(searchResponse);
                console.log('$$$$$', searchResponse);
              }}
            >
              Search
            </Button>
          </div>
        </div>

        {searchResults && searchType === 'card' && (
          // searchResults.map((el) => {
          //   return <h1>{el.monsterName}</h1>;
          // })
          <div className='cardGridContainer'>
            <CardGrid cardList={searchResults} />
          </div>
        )}
      </Layout>
      <div style={{ height: 1 }}></div>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  return {
    props: { session }, // will be passed to the page component as props
  };
}
