import { createUserWithEmailAndPassword, signInWithEmailAndPassword ,sendPasswordResetEmail} from 'firebase/auth'
import { getAuth , UserCredential} from 'firebase/auth'
import { inserirUsuario } from './users';
import { router } from 'expo-router';

export async function criarConta(email:string,senha:string) {
  const auth = getAuth();
  let retorno = {};
  retorno.email = email;
  retorno.senha = senha;
  
  inserirUsuario(retorno);
  await createUserWithEmailAndPassword(auth, email,senha)
    .then((credenciais) => {
      retorno.id = credenciais.user.uid;
      retorno.email = email;
      retorno.senha = senha;
      
      
    })
    .catch((error) => {
      retorno.erro = "login inválido";
    })
   
  return retorno;
}

const login = async (email: string, password: string, setSession: any) => {
  const auth = getAuth();
  
  try{
      const response: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const user: any = response.user.toJSON();
      setSession(user.email);


      return router.replace("(tabs)");
  }catch (error) {
      console.error('Error during login:', error);
      throw error;
  }
}

async function esqueciSenha(email: string) {
  const auth = getAuth();
  sendPasswordResetEmail(auth, email)
  .then(() => {
    
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ..
  });
}

export {login, esqueciSenha};