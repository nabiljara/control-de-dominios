import { NotificationType } from "@/constants";
import {
  Body,
  Button,
  Column,
  Container,
  Font,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";

interface ClientEmailProps {
  domain: string;
  expirationDate: string;
  type: NotificationType;
  expire: 'expired' | 'today' | 'soon';
  primaryColor: '#60C9A1' | "#FF5B5B";
}
const baseUrl = process.env.BASE_URL ? process.env.BASE_URL : "";
export default function ClientEmail({
  domain,
  expirationDate,
  type,
  primaryColor,
  expire,
}: ClientEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Manrope:wght@200..800&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
        <style>
          {`
      @media screen and (max-width: 600px) {
        .container {
          width: 90% !important;
          min-width: unset !important;
        }
        .container-footer {
          width: 90% !important;
          min-width: unset !important;
        }
        .button {
          display: block !important;
          width: 100% !important;
          text-align: center !important;
          padding: 16px 0 !important;
        }
        .header-row {
          display: flex !important;
          flex-direction: column !important;
          align-items: flex-start !important;
        }
        .header-column {
          text-align: left !important;
          width: 100% !important;
        }
      }
    `}
        </style>
      </Head>
      <Preview>Tu dominio {domain}</Preview>
      <Body style={main}>
        {/* CONTAINER CON EL GRADIENTE, USADO COMO BORDE */}
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "600px",
            maxWidth: "600px",
            borderRadius: "15px",
            padding: "2px",
            background: `linear-gradient(to top, ${primaryColor} -10%, transparent 100%)`,
          }}
          className="container"
        >
          <table
            role="presentation"
            width="100%"
            cellPadding="0"
            cellSpacing="0"
          >
            <tbody>
              <tr>
                <td>
                  <Container
                    style={{
                      margin: "0",
                      marginTop: "10px",
                      borderRadius: "15px",
                      backgroundColor: "#ffffff",
                      padding: "2px",
                      width: "100%",
                      maxWidth: "100%",
                      height: "100%",
                      minHeight: "100%",
                    }}
                  >
                    {/* CONTAINER CON FONDO BLANCO */}
                    <Section style={headerStyle}>
                      <Row className="header-row">
                        <Column
                          className="header-column"
                          style={logoColumnStyle}
                        >
                          <Img
                            src={
                              expire === "expired" || expire === "today"
                                ? `${baseUrl}/images/kernel-black.png`
                                : `${baseUrl}/images/kernel-color.png`
                            }
                            alt="Kernel"
                            className="w-[120px] h-[24px]"
                          />
                        </Column>
                        <Column
                          className="header-column"
                          style={partnerColumnStyle}
                        >
                          <Text style={partnerText(primaryColor)}>
                            TU PARTNER TECNOLÓGICO
                          </Text>
                        </Column>
                      </Row>
                    </Section>

                    <Section>
                      <Row>
                        <Column
                          style={{
                            width: "100%",
                            padding: "24px 32px",
                          }}
                        >
                          <Text style={titleStyle(primaryColor)}>
                            {`Tu dominio ${type === 'Vencido' ? 'ha ': ''}${type.toLocaleLowerCase()}`}
                          </Text>
                          <Text style={paragraph}>
                            Tu dominio <strong style={bold}>{domain}</strong>{" "}
                            {expire === "today" ? (
                              "caduca el día de hoy"
                            ) : expire === "expired" ? (
                              <>
                                caducó el{" "}
                                <strong style={bold}>{expirationDate}</strong>
                              </>
                            ) : (
                              <>
                                caduca el{" "}
                                <strong style={bold}>{expirationDate}</strong>
                              </>
                            )}
                          </Text>
                          <Text style={paragraph}>
                            {expire === "expired" ? (
                              <>
                                Lamentamos que tus servicios hayan dejado de
                                funcionar, respondé este correo o contactate con
                                nuestra área administrativa para activarlos. Te
                                ayudaremos con el proceso de recuperación.
                              </>
                            ) : (
                              <>
                                Para mantener tu sitio web en funcionamiento,
                                respondé este correo o contactate con nuestra
                                área administrativa. Te ayudaremos con el
                                proceso de renovación.
                              </>
                            )}
                          </Text>
                          <Text style={paragraph}>
                            <strong style={bold}>Importante:</strong> Si querés
                            conservar tu dominio, es necesario renovarlo. Si no
                            lo hacés a tiempo, podrían aplicarse tarifas
                            adicionales
                            {expire === "expired" || expire === "today"
                              ? " o podrías perderlo"
                              : ""}
                            .
                          </Text>
                          <Button
                            href={
                              expire === "expired"
                                ? "https://wa.me/542975178507?text=Hola%21%20Necesito%20recuperar%20mi%20dominio."
                                : "https://wa.me/542975178507?text=Hola%21%20Necesito%20hacer%20la%20renovaci%C3%B3n%20de%20mi%20dominio."
                            }
                            style={buttonStyle(primaryColor)}
                            className="button"
                          >
                            {expire === "expired" ? (
                              <>Recuperar ahora</>
                            ) : (
                              <>Renovar ahora</>
                            )}
                          </Button>
                        </Column>
                      </Row>
                    </Section>
                  </Container>
                </td>
              </tr>
            </tbody>
          </table>
          {/* GRADIENTE */}
        </Container>
        <Container style={containerFooter} className="container-footer">
          <Section style={footerStyle}>
            <Row>
              <Column style={textLeftFooter}>
                <Text style={footerText}>© 2025 Kernel S.A.S.</Text>
              </Column>
              <Column style={textRightFooter}>
                <Link href="https://kerneltech.dev/legales" style={privacyLink}>
                  Política de privacidad
                </Link>
              </Column>
            </Row>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#F2F2F2",
  fontFamily: "Inter, Arial, sans-serif",
  width: "100%",
  marginTop: "10px",
  marginBottom: "10px",
};

const containerFooter = {
  margin: "10px auto",
  maxWidth: "600px",
  overflow: "hidden",
  border: "none",
  backgroundColor: "#F2F2F2",
};

const headerStyle = {
  width: "100%",
  padding: "0",
  marginTop: "20px",
};
const partnerText = (color: string) => ({
  color: `${color === "#FF5B5B" ? "#131E3C" : "#38BC89"}`,
  fontSize: "14px",
  lineHeight: "20px",
  fontWeight: "700",
  margin: "0",
  textAlign: "right" as const,
});
const logoColumnStyle = {
  padding: "24px 32px",
  textAlign: "left" as const,
};
const partnerColumnStyle = {
  padding: "24px 32px",
  textAlign: "right" as const,
};
const textLeftFooter = {
  padding: "24px 32px",
  textAlign: "left" as const,
};
const textRightFooter = {
  padding: "24px 32px",
  textAlign: "right" as const,
};

const titleStyle = (titleColor: string) => ({
  fontSize: "25px",
  fontWeight: "700",
  color: `${titleColor === "#FF5B5B" ? "#FF5B5B" : "#131E3C"}`,
  marginBottom: "20px",
  marginTop: "10px",
  lineHeight: "28px",
});

const paragraph = {
  fontSize: "18px",
  fontWeight: "300",
  lineHeight: "28px",
  color: "#131E3C",
  marginBottom: "16px",
};

const bold = {
  fontWeight: "700",
};

const buttonStyle = (backgroundColor: string) => ({
  backgroundColor: `${backgroundColor === "#FF5B5B" ? "#FF5B5B" : "#38BC89"}`,
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  marginTop: "10px",
  marginBottom: "40px",
  padding: "14px 55px",
});

const footerStyle = {
  width: "100%",
  padding: "0",
};

const footerText = {
  fontSize: "14px",
  color: "#1E1E1E",
  margin: "0",
};

const privacyLink = {
  fontSize: "14px",
  color: "#1E1E1E",
  textDecoration: "underline",
};
