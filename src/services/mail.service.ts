import { Service, Inject } from 'typedi';
import { createTransport } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { ConfigToken, LoggerToken, Logger } from '../common/tokens';
import { Config } from '../common/interfaces';
import { Account } from '../entities';
import { MailError } from '../common/errors';

@Service()
class MailService {
  private mailTransporter: Mail;

  private mailFrom = '"Rental App" <rental-app@cubiccat.pl>';

  constructor(@Inject(ConfigToken) private config: Config, @Inject(LoggerToken) private logger: Logger) {
    this.mailTransporter = createTransport({
      host: config.mail.host,
      port: config.mail.port,
      secure: config.mail.secure,
      auth: {
        user: config.mail.user,
        pass: config.mail.pass
      }
    });
  }

  public sendMail(to: string, subject: string, message: string) {
    if (this.config.mail.enabled)
      return this.mailTransporter
        .sendMail({
          from: this.mailFrom,
          to,
          subject,
          text: message
        })
        .catch(error => this.logger.error(new MailError('Cannot send mail', error)));
  }

  public sendMailToAccount(account: Account, subject: string, message: string) {
    return this.sendMail(`${account.firstName} ${account.lastName}, ${account.email}`, subject, message);
  }

  public sendMailToMultipleAccounts(accounts: Account[], subject: string, message: string) {
    return Promise.all(accounts.map(account => this.sendMailToAccount(account, subject, message)));
  }
}

export default MailService;
