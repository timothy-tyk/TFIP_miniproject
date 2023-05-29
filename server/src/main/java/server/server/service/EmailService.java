package server.server.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import server.server.model.InviteEmail;

@Service
public class EmailService {
  @Autowired
  JavaMailSender javaMailSender;
  @Value("${spring.mail.username}") private String sender;

  public String sendInviteEmail(InviteEmail email){
    String greeting = String.format("Hello there %s, your friend %s has invited you to join us at Listening Room! Click on the invite link and sign up today! \n www.https://listening-room-production-24f9.up.railway.app/ \nP.S. %s", email.getName(), email.getSenderName(), email.getMessage());
  
    try {
      
      SimpleMailMessage mailMessage = new SimpleMailMessage();
      mailMessage.setFrom(sender);
      mailMessage.setTo(email.getRecipientEmail());
      mailMessage.setText(greeting);
      mailMessage.setSubject("Invitation to Listening Room");
      javaMailSender.send(mailMessage);
      return "Mail Sent Successfully.";
    } catch (Exception e) {
      System.out.println(e);
      return "Error while Sending Mail.";
    }
  }
}
