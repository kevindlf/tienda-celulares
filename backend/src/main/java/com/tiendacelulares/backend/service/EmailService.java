package com.tiendacelulares.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import com.tiendacelulares.backend.model.Orden;
import com.tiendacelulares.backend.model.OrdenItem;
import com.tiendacelulares.backend.model.Usuario;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.text.DecimalFormat;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${MAIL_USERNAME:}")
    private String correoTienda;
    private final DecimalFormat formatoDinero = new DecimalFormat("#,##0");

    /**
     * Envia un correo electrónico con formato HTML.
     */
    private void enviarCorreoHtml(String destinatario, String asunto, String contenidoHtml) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(correoTienda);
            helper.setTo(destinatario);
            helper.setSubject(asunto);
            helper.setText(contenidoHtml, true); // true = es HTML
            
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace();
            System.err.println("Error enviando correo a: " + destinatario);
        }
    }

    /**
     * Correo automático enviado al cliente al crear o pagar una orden.
     */
    @Async
    public void enviarConfirmacionOrden(Orden orden, Usuario cliente) {
        if (cliente == null || cliente.getEmail() == null || cliente.getEmail().isEmpty()) return;

        String asunto = "Confirmación de tu pedido #" + orden.getId() + " - Tienda Celulares";
        
        StringBuilder itemsHtml = new StringBuilder();
        for (OrdenItem item : orden.getItems()) {
            String nombreProducto = item.getProducto() != null ? item.getProducto().getNombre() : "Producto Desconocido";
            itemsHtml.append("<tr>")
                     .append("<td style='padding: 10px; border-bottom: 1px solid #ddd;'>").append(item.getCantidad()).append("x ").append(nombreProducto).append("</td>")
                     .append("<td style='padding: 10px; border-bottom: 1px solid #ddd; text-align: right;'>$").append(formatoDinero.format(item.getSubtotal())).append("</td>")
                     .append("</tr>");
        }

        String contenidoHtml = String.format("""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #2563eb; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">¡Gracias por tu compra!</h1>
                </div>
                <div style="padding: 30px;">
                    <p style="font-size: 16px;">Hola <b>%s</b>,</p>
                    <p style="font-size: 16px;">Hemos recibido tu orden <b>#%d</b> correctamente. A continuación te detallamos los productos:</p>
                    
                    <table style="width: 100%%; border-collapse: collapse; margin-top: 20px; margin-bottom: 20px;">
                        %s
                        <tr>
                            <td style="padding: 10px; font-weight: bold; text-align: right; border-bottom: 2px solid #333;">TOTAL</td>
                            <td style="padding: 10px; font-weight: bold; text-align: right; border-bottom: 2px solid #333; color: #2563eb; font-size: 18px;">$%s</td>
                        </tr>
                    </table>
                    
                    <p style="font-size: 14px; color: #666; margin-top: 30px; text-align: center;">
                        Si tenés alguna duda, respondé a este correo o contactanos por WhatsApp.
                    </p>
                </div>
            </div>
            """, 
            cliente.getNombre(), 
            orden.getId(), 
            itemsHtml.toString(), 
            formatoDinero.format(orden.getTotal())
        );

        enviarCorreoHtml(cliente.getEmail(), asunto, contenidoHtml);
    }

    /**
     * Correo enviado al cliente cuando su pedido cambia de estado (ej: ENVIADO).
     */
    @Async
    public void enviarActualizacionEstado(Orden orden, Usuario cliente) {
        if (cliente == null || cliente.getEmail() == null || cliente.getEmail().isEmpty()) return;

        String asunto = "Actualización de tu pedido #" + orden.getId();
        
        String contenidoHtml = String.format("""
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; border: 1px solid #eaeaea; border-radius: 10px; overflow: hidden;">
                <div style="background-color: #10b981; color: white; padding: 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 24px;">Actualización de Envío</h1>
                </div>
                <div style="padding: 30px; text-align: center;">
                    <p style="font-size: 18px; margin-bottom: 10px;">Hola <b>%s</b>,</p>
                    <p style="font-size: 16px;">Tu pedido <b>#%d</b> acaba de cambiar de estado a:</p>
                    <div style="display: inline-block; background-color: #f3f4f6; color: #111827; font-weight: bold; padding: 10px 20px; border-radius: 5px; margin: 20px 0; font-size: 20px; letter-spacing: 1px;">
                        %s
                    </div>
                    <p style="font-size: 14px; color: #666; margin-top: 20px;">
                        ¡Nos aseguramos de que todo llegue perfecto a tus manos!
                    </p>
                </div>
            </div>
            """, 
            cliente.getNombre(), 
            orden.getId(), 
            orden.getEstado()
        );

        enviarCorreoHtml(cliente.getEmail(), asunto, contenidoHtml);
    }
}
