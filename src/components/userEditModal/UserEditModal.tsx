import React, { FC } from 'react'
import style from './userEditModal.module.css'
import { Updater } from 'use-immer'
import { IUsers } from '../../types/types'


type TIsModal = {
	edit: boolean
	add: boolean
}

interface IUserEditModalProps {
	setIsModal: React.Dispatch<React.SetStateAction<TIsModal>>
	updateUsers: Updater<IUsers[]>
	ID: React.MutableRefObject<number | null>
}

const UserEditModal:FC<IUserEditModalProps> = ({setIsModal, updateUsers, ID}) => {
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
			setIsModal(prev=>({...prev, edit: false}))
			return
		}

		
		if(!isEmailValid(email.value)){
			setIsError(prev => ({...prev, isEmailError: true}))
		}
		if(!isNameValid(name.value)){
			setIsError(prev => ({...prev, isNameError: true}))
		}else{
			updateUsers((draft)=>{
				const editingElem = draft.find(item => item.id === ID.current)
				if(editingElem) {
					editingElem.email = email.value
					editingElem.name = name.value
				}
			})
			setIsModal(prev=>({...prev, edit: false}))
		}
	}

	return (
		<section className={style.formEditUser}>
			<h3>Редактировать пользователя</h3>
			<form ref={formData}>
				<div>			
					<label htmlFor="name">Имя: </label>
					<input type="text" placeholder='Anton' name='name'/>
					{isError.isNameError ? <p className={style.error}>имя должно состоять от 1 до 20 символов</p> : null}
				</div>
				<div>
					<label htmlFor="email">Почта: </label>
					<input type="email" required placeholder='anton@bk.ru' name='email'/>
					{isError.isEmailError ? <p className={style.error}>некорректный майл</p> : null}
				</div>
				<button onClick={handleClickForm}>Редактировать</button>
			</form>
		</section>
	);
}
 
export default UserEditModal;