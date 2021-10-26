import styles from '../../styles/components/ButtonDate.module.css'

//props.data vem a data, mas cada botão tem sua data... então nao sei como
//fazer a gambiarra
//ja sei, chega mais isso, coloca no classNameatual
export function ButtonDate(props){
    return(
        <button 
            onClick={() => props.callbackParent()} 
            disabled={props.data===props.atual}
            className={(props.data===props.atual)?styles.cardDatesSelected:styles.cardDates }
        >
            <h2>{props.data}</h2>
        </button>
    )
}