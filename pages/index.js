import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid/';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AluraKutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';


function ProfileSideBar(props) {
  return (
    <Box as="aside"> 
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }}/>
      <hr />

      <p>
        <a className="boxLink" href={`https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
      <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
          {props.title} ({props.items.length})
      </h2>
      <ul>
          {/* {seguidores.map((item) => {
            return (
              <li key={item} >
                <a href={`/users/${item}`} key={item}>
                  <img src={item} />
                  <span>{item}</span>
                </a>
              </li>
            )
          })} */}
        </ul>
    </ProfileRelationsBoxWrapper>
  )
}


export default function Home(props) {
  const githubUser = props.githubUser;  
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = [
    'juunegreiros', 
    'omariosouto', 
    'peas', 
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

    const [seguidores, setSeguidores] = React.useState([])

    React.useEffect(function() {
      fetch('https://api.github.com/users/diogobruno91/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json()
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta) 
      })
    }, [])

    //API  GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'cdeadb69e96f05593bfd1d013f3359',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body:   JSON.stringify({ "query": `query{
        allCommunities {
          id
          title
          image
          creatorSlug
        }
      }` })
    })
    .then((resp) => resp.json())
    .then((respostaCompleta) => {
      const comunidadesResponse = respostaCompleta.data.allCommunities
      console.log('comunidadesResponse', comunidadesResponse);
      setComunidades(comunidadesResponse)
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
          <div className="profileArea" style={{ gridArea: 'profileArea' }}>
            <ProfileSideBar githubUser={githubUser} />
          </div>
          <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
            <Box>
              <h1 className="title">
                Bem vindo(a)
              </h1>

              <OrkutNostalgicIconSet />
            </Box>

            <Box>
              <h2 className="subTitle">O que você desejá fazer?</h2>
              <form onSubmit={function handleCriaComunidade(e) {
                e.preventDefault();
                const dadosDoForm = new FormData(e.target)
                

                const comunidade = {
                  title: dadosDoForm.get('title'),
                  image: dadosDoForm.get('image'),
                  creatorSlug: githubUser
                }

                fetch('/api/comunidades', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(comunidade) 
                })
                .then(async (resp) => {
                  const dadosRecebido = await resp.json();
                  console.log('dadosRecebido',dadosRecebido);
                })

                const comunidadesAtualizadas = [...comunidades, comunidade]
                setComunidades(comunidadesAtualizadas)
              }}>
                <div>
                  <input 
                    placeholder="Qual vai ser o nome da sua comunidade?" 
                    name="title"
                    aria-label="Qual vai ser o nome da sua comunidade"
                    type="text" 
                  />
                </div>
                <div>
                  <input 
                    placeholder="Coloque uma URL para usarmos de capa" 
                    name="image"
                    aria-label="Coloque uma URL para usarmos de capa" 
                  />
                </div>

                <button>
                  Criar comunidade
                </button>

              </form>
            </Box>
          </div>
          <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                Pessoas da comunidade ({pessoasFavoritas.length})
              </h2>

              <ul>
                {pessoasFavoritas.map((item) => {
                  return (
                    <li key={item}>
                      <a href={`/users/${item}`} key={item}>
                        <img src={`https://github.com/${item}.png`} />
                        <span>{item}</span>
                      </a>
                    </li>
                  )
                })}
              </ul>
            </ProfileRelationsBoxWrapper>
            <ProfileRelationsBoxWrapper>
              <h2 className="smallTitle">
                  comunidades ({comunidades.length})
              </h2>
              <ul>
                  {comunidades.map((item) => {
                    return (
                      <li key={item.id} >
                        <a href={`/community/${item.id}`} key={item.title}>
                          <img src={item.image} />
                          <span>{item.title}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
            </ProfileRelationsBoxWrapper>
            <ProfileRelationsBox title="Seguidores" items={seguidores} />

          </div>
      </MainGrid>
    </>
  )
}

export async function getServerSideProps(context){
  const cookies = nookies.get(context);
  const token = cookies.USER_TOKEN;

  const { isAuthenticated } = await fetch('http://localhost:3000/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then(resp => resp.json())

  if(!isAuthenticated){
    return{
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const  { githubUser }  = jwt.decode(token);
  return{
    props: {
      githubUser
    },
  }
}
