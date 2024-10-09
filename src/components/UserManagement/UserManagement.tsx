import { useImmer } from 'use-immer'
import editUserIcon from '../../assets//icons/editUserIcons.svg'
import deleteUserIcon from '../../assets/icons/deleteUserIcon.svg'
import style from './userManagement.module.css'
import React, { FC } from 'react'
import UserAddModal from '../userAddModal/UserAddModal'
import UserEditModal from '../userEditModal/UserEditModal'
import { IUsers } from '../../types/types'

type TIsModal = {
	edit: boolean
	add: boolean
}

const UserManagement:FC = () => {
	const [isModal, setIsModal] = React.useState<TIsModal>({
		edit: false,
		add: false
	})
	const USER_ID = React.useRef<number>(0)
	const SELECTED_USER_ID = React.useRef<number | null>(null)
	const [users, updateUsers] = useImmer<IUsers[]>([])

	function deleteUser(e: React.MouseEvent<HTMLDivElement>) {
		const element = e.target as HTMLElement
		if(!element) return
		const USER_ID = e.currentTarget.parentNode?.parentNode?.querySelector('#userId')?.textContent
		if(!USER_ID) return

		updateUsers((draft) => draft.filter(item => item.id !== +USER_ID))
	}

	function handleEditUserClick(e: React.MouseEvent<HTMLDivElement>) {
		const element = e.target as HTMLElement
		if(!element) return
		SELECTED_USER_ID.current = Number(e.currentTarget.parentNode?.parentNode?.querySelector('#userId')?.textContent as string | null)

		setIsModal(prev=>({...prev, edit: true}))
	}

	return (
		<main className={style.main}>
			{isModal.add ? <UserAddModal setIsModal={setIsModal} updateUsers={updateUsers} ID={USER_ID}/> : null}
			{isModal.edit ? <UserEditModal setIsModal={setIsModal} updateUsers={updateUsers} ID={SELECTED_USER_ID}/> : null}
			<section className={`${style.container} ${style.headerSection}`}>
				<h1>User Management</h1>
				<button onClick={() => setIsModal(prev=>({...prev, add: true}))}>Add User</button>
			</section>

			<section className={`${style.container} ${style.usersSection}`}>
				<ul>
					<li className={style.defaultListElem}>
						<span>Имя:</span>
						<span>Действия:</span>
					</li>

					{users
						? users.map(item => (
								<li key={item.id}>
									<div className={style.userData}>
										<span style={{display:"none"}} id='userId'>{item.id}</span>
										<span>{item.name}</span>
										<span>{item.email}</span>
									</div>

									<div className={style.userActions}>
										<div onClick={handleEditUserClick}>
											<img src={editUserIcon} alt='editUserIcon' width={20}/>
											<span>Редактировать</span>
										</div>
										<div onClick={deleteUser}>
											<img src={deleteUserIcon} alt='deleteUserIcon'  width={20}/>
											<span>Удалить</span>
										</div>
									</div>
								</li>
						  ))
						: null}
				</ul>
			</section>
		</main>
	)
}

export default UserManagement
