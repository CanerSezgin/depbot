import sendEmail from '../services/email';
import subscribeService from '../services/subscribe';
import repoService from '../services/repo';
import { platforms } from '../services/platforms';
import { getDayTime } from '../utils/time';

const getReportAndSendEmail = async (repo: string, email: string) => {
  const platform = new platforms.Github();
  const repoResult = await repoService.get(repo, platform);
  const response = repoResult.map((fileResult) => {
    return {
      meta: {
        repo,
        platform,
        ...fileResult.opts,
        ...fileResult.meta,
      },
      staleDeps: fileResult.staleDependencies,
    };
  });
  const content = JSON.stringify(response);
  await sendEmail(email, content);
};

/* Note that:
 * setInterval will NOT give you exact duration to run this function
 * Because nothing is pushed from Event Queue to Call Stack as long as Call Stack is not empty.
 * But for this use case, we don't care whether function is called in particular/exact time
 * (approximately 1 min period is more than enough to satisfy the requirements)
 */
export default (duration = 60000) => {
  const intervalId = setInterval(() => {
    const now = new Date();
    const dayMinTime = getDayTime(now, 'min');
    console.log('Send Report |', { now, dayMinTime });

    subscribeService
      .getByDayMin(dayMinTime)
      .then((subs) => {
        console.log(`Report sending to ${subs.length} Subscribers`);
        subs.forEach((sub) => {
          const { repo, email } = sub;
          /**
           * Enhancement Point
           * This then statement should be added into queue rather than directly calling function itself.
           * It will provide more persistance
           */
          getReportAndSendEmail(repo, email)
            .then(() => console.log(`${repo} | ${email} | Email Sent`))
            .catch((e) => console.log(e));
        });
      })
      .catch((e) => console.log(e));
  }, duration);

  const stop = () => clearInterval(intervalId);
  return { stop };
};
