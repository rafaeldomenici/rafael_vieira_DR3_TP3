import Avatar from "@/components/avatar/avatar";
import Button from "@/components/button/button";
import Fab from "@/components/fab/fab";
import Grid from "@/components/grid/grid";
import TextInput from "@/components/textinput/textinput"
import Topbar from "@/components/navigation/topbar";
import Camera from "@/components/camera/camera";
import { getStorage, ref , uploadBytes, getDownloadURL} from "firebase/storage";
import Snackbar from "@/components/snackbar/snackbar"
  
import {useRef, useState, useEffect} from "react";
import * as ImagePicker from "expo-image-picker";
import { ScrollView } from "react-native";
import { getAuth } from "firebase/auth"
import {useSession} from "@/app/ctx";
import { alterarUsuario, listarUsuarios } from "@/services/users";
export default function ProfileScreen() {

  const storage = getStorage();
  
  const { session } = useSession();
  const [image, setImage] = useState(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const cameraRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [controle, setControle] = useState(false);
  const [messageText, setMessageText] = useState(null);

  const [data, setData] = useState({
      photoURL: null
  });


 
  async function fetchData() {
    let lista = await listarUsuarios();
    let obj = {}
    for(let l of lista) {
      if(l.email == session) {
        obj = l;
      }
    }
    getDownloadURL(ref(storage,`fotoUser/${data.id}.jpg`)).then((url) => obj.photoURL = url)
    .catch((error) => console.log("erro"))
    setData(obj);
  }  

  useEffect(() => {
   fetchData();
   
  }, [])
  

  const pickImage = async () => {
      // No permissions request is necessary for launching the image library
      let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsMultipleSelection: false,
          aspect: [4, 3],
          quality: 1,
      });
      setLoading(true);

      if (!result.canceled) {
          setData((v: any) => ({
              ...v,
              photoURL: result.assets[0].uri
          }));
      }

      setLoading(false);
  };

  const onCapture = (photo: any) => {
      setData((v: any) => ({
          ...v,
          photoURL: photo.uri
      }));
  }

  return  <>  <ScrollView>
              <Grid>
                  <Grid>
                      <Topbar title="Perfil"/>
                  </Grid>
                  <Grid>
                      <Grid style={{
                          ...styles.containerImage
                      }}>
                          <Grid style={{
                              ...styles.containerCenterImage
                          }}>
                              {
                                  data.photoURL ? <Avatar size={230} source={{uri: data.photoURL}} /> : <Avatar size={230} icon="account" />
                              }
                              <Fab
                                  onPress={pickImage}
                                  icon="image"
                                  style={{
                                      ...styles.fab,
                                      ...styles.left
                                  }}/>
                              <Fab
                                  onPress={() => setCameraVisible(true)}
                                  icon="camera"
                                  style={{
                                      ...styles.fab,
                                      ...styles.right
                                  }}/>
                          </Grid>
                      </Grid>
                  </Grid>
                  <Grid style={{
                      marginTop: 30,
                      ...styles.padding
                  }}>
                      <TextInput
                          label="Nome"
                          value={data.displayName}
                          onChangeText={(text) => setData((v: any) => ({...v, displayName: text}))}
                      />
                  </Grid>
                  <Grid style={{
                      ...styles.padding
                  }}>
                      <TextInput
                          label="Nome de usuário"
                          value={data.username}
                          onChangeText={(text) => setData((v: any) => ({...v, username: text}))}
                      />
                  </Grid>
                  <Grid style={{
                      ...styles.padding
                  }}>
                      <TextInput
                          label="E-mail"
                          keyboardType="email-address"
                          value={data.email}
                          disabled
                      />
                  </Grid>
                  <Grid style={{
                      ...styles.padding
                  }}>
                      <TextInput
                          label="Telefone"
                          keyboardType="numeric"
                          value={data.phoneNumber}
                          onChangeText={(text) => setData((v: any) => ({...v, phoneNumber: text}))}
                      />
                  </Grid>
                  <Grid style={{
                      ...styles.padding
                  }}>
                      <Button
                          loading={loading}
                          mode="contained" onPress={async () => { 
                            const imagesRef = ref(storage,`fotoUser/${data.id}.jpg`);
                            uploadBytes(imagesRef, data.photoURL).then((snapshot) => {console.log(data.photoURL)})
                            let lista = await listarUsuarios();
                            let obj = {};
                            for(let l of lista) {
                              if(l.email == session) {
                                obj = l;
                              }
                            }
                            obj = {...obj, ... data}
                            await alterarUsuario(obj);
                            setMessageText("Dados alterados com sucesso")
                            } }>
                          Salvar
                      </Button>
                  </Grid>
              </Grid>
              {
                  cameraVisible ? <Camera
                      onCapture={onCapture}
                      setCameraVisible={setCameraVisible}
                      ref={cameraRef}
                  /> : null
              }
              <Snackbar
          visible={messageText !== null}
          onDismiss={() => setMessageText(null)}
          text={messageText} />
              </ScrollView>
          </>
}

const styles = {
  containerImage: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 20,
  },
  padding: {
      padding: 16
  },
  containerCenterImage: {
      width: 230,
      position: 'relative',
  },
  fab: {
      bottom: 0,
      position: 'absolute',
      borderRadius: 200
  },
  right: {
      right: 0,
  },
  left: {
      left: 0
  }
}