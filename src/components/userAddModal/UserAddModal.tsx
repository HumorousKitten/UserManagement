import React, { FC } from 'react';
import style from './userAddModal.module.css'
import { Updater } from 'use-immer'
import { IUsers } from '../../types/types';

type TIsModal = {
	edit: boolean
	add: boolean
}

interface IUserAddModalProps {
	setIsModal: React.Dispatch<React.SetStateAction<TIsModal>>
	updateUsers: Updater<IUsers[]>
	ID: React.MutableRefObject<number>
}

const UserAddModal:FC<IUserAddModalProps> = ({setIsModal, updateUsers, ID}) => {
	const formData = React.useRef<HTMLFormElement | null>(null)
	const [isError, setIsError] = React.useState({
		isEmailError: false,
		isNameError: false 
	})


	function isEmailValid(value: string):boolean {
		const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(value)
	}
	
	function isNameValid(value: string):boolean {
		const nameRegex: RegExp = /^[a-zA-Z]{1,20}$/
		return nameRegex.test(value)
	}
	

	function handleClickForm() {
		const name= formData.current?.querySelectorAll('input')[0]
		const email = formData.current?.querySelectorAll('input')[1]
		if(!name || !email){
			setIsModal(prev=>({...prev, add: false}))
			return
		}

		if(!isEmailValid(email.value)){
			setIsError(prev => ({...prev, isEmailError: true}))
		}
		if(!isNameValid(name.value)){
			setIsError(prev => ({...prev, isNameError: true}))
		}else{
			updateUsers((draft)=>{
				draft.push({
					id: ID.current++,
					name: name.value,
					email: email.value
				})
			})
			setIsModal(prev=>({...prev, add: false}))
		}
	}

	return (
		<section className={style.formAddUser}>
			<h3>Добавить пользователя</h3>
			<form ref={formData}>
				<div>			
					<label htmlFor="">Имя: </label>
					<input type="text" placeholder='Anton'/>
					{isError.isNameError ? <p className={style.error}>имя должно состоять от 1 до 20 символов</p> : null}
				</div>
				<div>
					<label htmlFor="">Почта: </label>
					<input type="email" required placeholder='anton@bk.ru'/>
					{isError.isEmailError ? <p className={style.error}>некорректный майл</p> : null}
				</div>
				<button onClick={handleClickForm}>Добавить</button>
			</form>
		</section>
	);
}
 
export default UserAddModal;