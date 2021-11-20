const dateString = (d, time_y_n) => {

        let date = new Date(d);
        let day = date.getDate();
        let month = date.getMonth()+1;
        let year = date.getFullYear();
        let hours = date.getHours();
        let minutes = date.getMinutes();
    if (time_y_n === 'y'){
        return(day + "/" + month + "/" + year + " " + hours + ":" + minutes);
    } else {
        return(day + "/" + month + "/" + year)
    }
};






const func = {
    date: dateString,
}


export default func;
