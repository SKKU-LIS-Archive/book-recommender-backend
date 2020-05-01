import { Request, Response } from "express";
import { auth } from "../app";
import { mailer } from '../utils/mailer';
import { db } from '../app';
import axios from 'axios'

export async function signUp (req: Request, res: Response) {
  const email = req.body.email;
  const phoneNumber = req.body.phoneNumber;
  const studentNumber = req.body.studentNumber;
  const password = req.body.password;

  let user;
  try {
    user = await auth.createUser({
      email,
      emailVerified: false,
      password,
      displayName: String(studentNumber),
      disabled: false,
    });
    if (user) {
      await db.collection('users').add(user);
      const link = await auth.generateEmailVerificationLink(email);
      mailer.sendMail({
        from: 'godwmaw.ml@gmail.com',
        to: user.email,
        subject: "인증 이메일",
        text: `인증을 위해 다음의 링크를 클릭해주세요 ==> ${link}`
      })        
      res.status(200).send(
        `등록하신 ${user.email} 이메일로 인증 이메일을 보냈습니다`
      );  
    }
  } catch (error) {
    console.log(error);
    res.status(500).end(false);
  }
   
  
};

export const login = (req: Request, res: Response) => {
  const {email, password} = req.body
  return axios.post('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA_9Neh3tKcUIotHGxvEP2-jGKhvXxMoj4', {
    "email": email,
    "password": password,
    "returnSecureToken": true
  })
}

// export const login = (req: Request, res: Response) => {
//   const email = req.body.email;
//   const phoneNumber = req.body.phoneNumber;
//   const password = req.body.password;

//   auth
//     .getUserByEmail(email)
//     .then((user) => {
//       return auth.listUsers()
//     })
//     .then(userRecords => {
//       let userMatched;
//       userRecords.users.forEach(user => {
//         if (user.passwordHash) {
//           // 둘다 해볼까
//           const passwordBuffer = new Buffer(password);
//           const passwordEncoded = passwordBuffer.toString('base64');
          
//           const passwordHashBuffer = new Buffer(user.passwordHash, 'base64');
//           const decodedPasswordHash = passwordHashBuffer.toString('utf8')
//           console.log(user);
//           console.log(user.passwordHash);
//           console.log(user.passwordSalt);
//           if (user.passwordHash == passwordEncoded) {
//             userMatched = user;
//           }
//         }
//       })

//       if (userMatched) {
//         res.send(userMatched);
//       } else {
//         res.send('맞는 비밀번호가 없습니다.')
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// };

export async function logout (req: Request, res: Response) {
  const userId = req.params.userId;
  
  try {
    const deletedUser = await auth.updateUser(userId, {
      disabled: true,
    });

    if (deletedUser) {
      await db.collection('users').doc(deletedUser.uid).delete()
    }

    res.status(200).send(true);

  } catch (error) {
    console.log(error);
    res.status(500).end(false)
  }
  
};

// Update 는 권한 상 구현 안하는 걸로

// export const updateUserAccount = (req: Request, res: Response) => {
//   const userId = req.body.userId;
//   const email = req.body.email
//   const phoneNumber = req.body.phoneNumber;
//   const password = req.body.password;

//   auth.updateUser(userId, {
//     email,
//     phoneNumber,
//     password,
//   })
// }

export async function terminateUserAccount (req: Request, res: Response) {
  const userId = req.params.userId;

  try {
    await  auth.deleteUser(userId)
    res.status(200).send(true);

  } catch (error) {
    console.log(error);
    res.status(500).end(false);
  }
};
