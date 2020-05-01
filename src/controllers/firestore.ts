import { Request, Response } from 'express';
import { db }  from '../app'
import axios from 'axios';

export async function getRecommendationList (req: Request, res: Response) {
	const userId: any = req.query.userId;
	const algorithmId = req.query.algorithmId;
	
	const books: any = axios.get(`URL ${algorithmId}`)
	
	try {
		for (let book of books) {
			const bookData = await db.collection('books').add(book);
			// 일대다 공부를 다시 해봐야겠는데
			await db.collection('users_books').add({
				userId: userId,
				bookId: bookData.id
			})
		}
	} catch (error) {
		console.log(error);
		res.status(500).end(false);	
	}
}

// export const getDoc = () => {

// }

// export const getAllDoc = () => {

// }

// export const createDoc = () => {

// }

// export const updateDoc = () => {

// }

// export const deleteDoc = () => {

// }
