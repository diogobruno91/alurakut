import React from 'react';
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


export default function Home() {
  const githubUser = 'diogobruno91'  
  const [comunidades, setComunidades] = React.useState([{
    id: '123456',
    title: 'Eu odeio acordar cedo',
    image: 'https://alurakut.vercel.app/capa-comunidade-01.jpg'
  }]);
  const pessoasFavoritas = [
    'juunegreiros', 
    'omariosouto', 
    'peas', 
    'rafaballerini',
    'marcobrunodev',
    'felipefialho'
  ]

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
                  id: new Date().toISOString(),
                  title: dadosDoForm.get('title'),
                  image: dadosDoForm.get('image')
                }
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
                        <a href={`/users/${item.title}`} key={item.title}>
                          <img src={item.image} />
                          <span>{item.title}</span>
                        </a>
                      </li>
                    )
                  })}
                </ul>
            </ProfileRelationsBoxWrapper>
          </div>
      </MainGrid>
    </>
  )
}
