import { Grid } from "@mantine/core";
import {HiHome, HiSearch} from 'react-icons/hi'
import {IoCreateSharp} from 'react-icons/io5'
import Link from "next/link";


export default function FooterMenu(){
  return (
    <Grid gutter={0} className="footerMenu">
      <Grid.Col span={4} className="footerGrid"><Link href="/"><HiHome/></Link>Home</Grid.Col>
      <Grid.Col span={4} className="footerGrid"><Link href="/login"><HiSearch /></Link>Search</Grid.Col>
      <Grid.Col span={4} className="footerGrid"><Link href="/create"><IoCreateSharp /></Link>Create</Grid.Col>
    </Grid>
  )
}
