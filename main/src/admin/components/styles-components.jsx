import styled from 'styled-components';


export const StageCreateDialogStyles = {   
    overlay: { display: "flex", flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
    content: { 
        width: '300px', 
        height: '350px', 
        top: 'calc(50% - 150px)',
        left: 'calc(50% - 150px)'
    }
}
export const moveToNextStageDialogStyles = {
    overlay: { display: "flex", flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
    content: {
        width: '400px',
        height: '500px',
        top: 'calc(50% - 250px)',
        left: 'calc(50% - 150px)'
    }
}

export const CardsWrapper = styled.div`
    width: 100%;
    margin-top: 15px;
    /* height: 15px; */
    /* background-color: red; */
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`;

export const EventStageCard = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 15px;
    box-shadow: 1px 2px 6px rgba(0, 0, 0, .28);

    &>*{
        margin: 10px 0;
    }
`;

export const CreateStageDialog = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .actions{
        margin-top: 15px;
    }

    &>*:not(.actions){
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 10px 0;
        width: 100%;

        label{
            margin-bottom: 10px;
        }

        .input{
            width: 80%;
        }
    }
`;

export const ActionsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
`;