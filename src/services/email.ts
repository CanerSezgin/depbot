/**
 * This is mock email function, in order to simulate similar behavior, it is designed to take 0.5sec.
 */
export default async (email: string, content: string) => {
  return new Promise((resolve) => {
    console.log('>>> Email sending to', email);
    setTimeout(() => {
      resolve({ status: 'sent', email, content });
    }, 500);
  });
};
