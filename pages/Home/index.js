import styles from '../../styles/pages/Home.module.css'
import { useSession } from 'next-auth/client'
import { useState } from 'react';
import { useRouter } from 'next/router'

import { SideBar } from '../../components/SideBar';
import { BoxAvaliation } from '../../components/BoxAvaliation';
import { BoxProfile } from '../../components/BoxProfile';
import { BoxAdm } from '../../components/BoxAdm';

export default function Home() {

    const [page, setPage] = useState('avaliation')

    return (
        <div className={styles.container}>     
            <SideBar callbackParent={(result) => setPage(result)}/>
            {
                page === 'profile' ? <BoxProfile /> 
              : page === 'avaliation' ? <BoxAvaliation />:
                <BoxAdm />
            }        
        </div>
    )
}