import { StyleSheet } from 'react-native';
import Fab from '@/components/fab/fab';
import { useState, useEffect } from 'react';
import { Appbar } from 'react-native-paper'
import { router , Link} from 'expo-router'
import Topbar from '@/components/navigation/topbar'
import { View } from 'react-native'
import { excluirItem, excluirUsuario, listarItens, listarUsuarios } from '@/services/itensLista';
import Card from '@/components/card/card';
import { ScrollView } from 'react-native-gesture-handler';
import  Text  from '@/components/text/text'
import  Dialog from '@/components/dialog/dialog'
import {useSession} from '@/app/ctx'

export default function HomeScreen() {

  const [lista, setLista] = useState([]);
  const [controle, setControle] = useState(false);
  const [itemToDelete,setItemToDelete] = useState(null);
  const [dialogVisible,setDialogVisible] = useState(false);
  const {session} = useSession()
  async function fetchData() {
    let l = await listarItens();
    setLista(l);
  }
  
  let estilo = {
    backgroundColor: "lightblue",
    width: "50%"
  }
  
  useEffect(() => {
    fetchData();
   
  },[controle])

  function gerarImagens(imagens) {
    return imagens.map((img) => <Card estiloCover={{width: "50px", height: "50px"}} source={{uri : img}}/>)
  }


   
  return (
    <>
      <ScrollView>
      <Topbar title="Home" menu={true}/>
      
      <Link href="/componentes" style={styles.link}>
        <Text>Exemplo de uso dos componentes</Text>
      </Link>
      {lista.map((item) => {
          let botoes = [{label: "excluir", onPress: () => {
            setItemToDelete(item.id);
            setDialogVisible(true);
            
          }},{label: "editar", onPress: () => {
            router.navigate(`/form/${item.id}`)
          }}]
            
          
          return <View style={{backgroundColor: "lightblue", marginBottom: "10px", position: "relative", padding: "10px"}}><Card title={item.title} texto={[{label: item.description}]} buttons={botoes}/>
                 <View style={{display: "flex", flexDirection: "row",alignItems: "center", gap: "10px"}}>{item.images.length > 0 && <Text>Imagens:</Text>}{gerarImagens(item.images)}</View></View>
        
      })}
      <Fab
                    icon="plus"
                    onPress={() => {
                        router.navigate('/form/new');
                    }}
                    style={{
                        bottom: 10,
                        position: 'fixed',
                        borderRadius: 200,
                        right: 20,
                    }}/>
      </ScrollView>
      <Dialog
            icon={"alert"}
            title={"Excluir item"}
            text={"Deseja realmente excluir este item?"}
            visible={dialogVisible}
            setVisibility={setDialogVisible}
            onDismiss={() => setDialogVisible(false)}
            actions={[
                {
                    text: "Cancelar",
                    onPress: () => {
                        setDialogVisible(false);
                        setItemToDelete(null);
                        
                    }
                },
                {
                    text: "Excluir",
                    onPress: async () => {
                        await excluirItem(itemToDelete)
                        setControle(!controle);
                        setItemToDelete(null);   
                        setDialogVisible(false);
                    }
                }
            ]}
        />
    </>
    
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
