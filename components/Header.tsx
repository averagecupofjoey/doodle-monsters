import React from 'react';
import {
  createStyles,
  Header,
  Menu,
  Group,
  Center,
  Burger,
  Container,
} from '@mantine/core';
import { useBooleanToggle } from '@mantine/hooks';
import { ChevronDown } from 'tabler-icons-react';
import { FaPencilAlt } from 'react-icons/fa';
import { CgProfile } from 'react-icons/cg';
import Link from 'next/link';
const useStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.colors[theme.primaryColor][6],
    borderBottom: 0,
  },

  inner: {
    height: 56,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // links: {
  //   [theme.fn.smallerThan('sm')]: {
  //     display: 'none',
  //   },
  // },

  burger: {
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: '8px 12px',
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.white,
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 7 : 5],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

// interface HeaderSearchProps {
//   links: { link: string; label: string; links: { link: string; label: string }[] }[];
// }

// export function HeaderMenu({ links }: HeaderSearchProps) {
//   const [opened, toggleOpened] = useBooleanToggle(false);
//   const { classes } = useStyles();

//   const items = links.map((link) => {
//     const menuItems = link.links?.map((item) => (
//       <Menu.Item key={item.link}>{item.label}</Menu.Item>
//     ));

//     if (menuItems) {
//       return (
//         <Menu
//           key={link.label}
//           trigger="hover"
//           delay={0}
//           transitionDuration={0}
//           placement="end"
//           gutter={1}
//           control={
//             <a
//               href={link.link}
//               className={classes.link}
//               onClick={(event) => event.preventDefault()}
//             >
//               <Center>
//                 <span className={classes.linkLabel}>{link.label}</span>
//                 <ChevronDown size={12} />
//               </Center>
//             </a>
//           }
//         >
//           {menuItems}
//         </Menu>
//       );
//     }

//     return (
//       <a
//         key={link.label}
//         href={link.link}
//         className={classes.link}
//         onClick={(event) => event.preventDefault()}
//       >
//         {link.label}
//       </a>
//     );
//   });

//   return (
//     <Header height={56} className={classes.header} mb={120}>
//       <Container>
//         <div className={classes.inner}>
//           <FaPencilAlt />
//           <Group spacing={5} className={classes.links}>
//             {items}
//           </Group>
//           <Burger
//             opened={opened}
//             onClick={() => toggleOpened()}
//             className={classes.burger}
//             size="sm"
//             color="#fff"
//           />
//         </div>
//       </Container>
//     </Header>
//   );
// }

export function HeaderMenu() {
  // const [opened, toggleOpened] = useBooleanToggle(false);
  const { classes } = useStyles();

  // const items = links.map((link) => {
  //   const menuItems = link.links?.map((item) => (
  //     <Menu.Item key={item.link}>{item.label}</Menu.Item>
  //   ));

  //   if (menuItems) {
  //     return (
  //       <Menu
  //         key={link.label}
  //         trigger="hover"
  //         delay={0}
  //         transitionDuration={0}
  //         placement="end"
  //         gutter={1}
  //         control={
  //           <a
  //             href={link.link}
  //             className={classes.link}
  //             onClick={(event) => event.preventDefault()}
  //           >
  //             <Center>
  //               <span className={classes.linkLabel}>{link.label}</span>
  //               <ChevronDown size={12} />
  //             </Center>
  //           </a>
  //         }
  //       >
  //         {menuItems}
  //       </Menu>
  //     );
  //   }

  //   return (
  //     <a
  //       key={link.label}
  //       href={link.link}
  //       className={classes.link}
  //       onClick={(event) => event.preventDefault()}
  //     >
  //       {link.label}
  //     </a>
  //   );
  // });

  return (
    <Header height={56} className={classes.header} mb={20}>
      <Container>
        <div className={classes.inner}>
          <FaPencilAlt />
          Doodle Monsters
          {/* <Group spacing={5} className={classes.links}> */}
          {/* {items} */}
          <Link href='/profile'>
            <a>
              <CgProfile />
            </a>
          </Link>
          {/* </Group> */}
          {/* <Burger
            opened={opened}
            onClick={() => toggleOpened()}
            className={classes.burger}
            size="sm"
            color="#fff"
          /> */}
        </div>
      </Container>
    </Header>
  );
}
