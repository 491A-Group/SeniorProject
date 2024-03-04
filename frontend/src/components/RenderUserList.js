import "./RenderUserList.css"

import Garage from '../pages/GaragePage';
import DefaultProfilePicture from '../images/DefaultProfilePicture.png';

export default function RenderUserList({changePage, setActivePage, users}) {
    return <div>
        <ul className='unorderedUserList'>
            {users.map((name, index) => (
                <li key={index}>
                    <button className='userButtonLink' onClick={() => setActivePage(<Garage changePage={changePage} profile={name}/>)}>
                        <img src={DefaultProfilePicture}/> {name}
                    </button>
                </li>
            ))}
        </ul>
    </div>
}