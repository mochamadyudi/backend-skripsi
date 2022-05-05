import {CronJob} from 'cron'
// import CronJob from 'node-cron'
import AuthJobs from "../jobs/Auth.jobs";

export default () => {
    // let task = new CronJob(
    //     "* * 10 * * *",
    //     () => {
    //         console.log("eun!!");
    //     },
    //     () => {
    //         console.log("error!!");
    //     },
    //     true,
    //     "Asia/Jakarta",
    //     {},
    //     false
    // );
    //
    // task.start();
    // const flagOn = true;
    // task.addCallback(()=> {
    //     console.log('testing run')
    // })
    // setInterval(() => {
    //     console.log(task.running);
    //     task.addCallback(()=> {
    //         console.log('testing run')
    //     })
    //     if (!flagOn) {
    //         clearInterval(interval);
    //     }
    // }, 10000)

// while (flagOn) {
//     setTimeout(() => {
//         console.log("entro");
//     }, 10000);
// }
}
