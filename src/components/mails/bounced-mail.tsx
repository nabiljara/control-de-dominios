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

interface BouncedEmailProps {
  emailTo: string;
  contactId: number | null;
}
const baseUrl = process.env.BASE_URL ? process.env.BASE_URL : "";

export default function BouncedMail({ emailTo, contactId }: BouncedEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonets.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Manrope:wght@200..800&display=swap",
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
      <Preview>Email no enviado.</Preview>
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
            background:
              "linear-gradient(to top, #FF5B5B -10%, transparent 100%)",
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
                            src={`${baseUrl}/images/kernel-black.png`}
                            alt="Kernel"
                            className="h-[24px] w-[120px]"
                          />
                        </Column>
                        <Column
                          className="header-column"
                          style={partnerColumnStyle}
                        >
                          <Text style={partnerText}>
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
                          <Text style={titleStyle}>
                            Email no enviado correctamente
                          </Text>
                          <Text style={paragraph}>
                            No se pudo entregar correctamente el correo de
                            vencimiento a{" "}
                            <strong style={bold}>{emailTo}</strong>, revise este{" "}
                            <a href={`${baseUrl}/contacts/${contactId}`}>
                              <strong
                                style={{
                                  fontWeight: "700",
                                  textEmphasisStyle: "underline",
                                }}
                              >
                                contacto
                              </strong>
                            </a>{" "}
                            y sus dominios asociados.
                          </Text>

                          <Button
                            href={`${baseUrl}/contacts/${contactId}`}
                            style={buttonStyle}
                            className="button"
                          >
                            Ver contacto
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
const partnerText = {
  color: "#FF5B5B",
  fontSize: "14px",
  lineHeight: "20px",
  fontWeight: "700",
  margin: "0",
  textAlign: "right" as const,
};
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

const titleStyle = {
  fontSize: "25px",
  fontWeight: "700",
  color: "#131E3C",
  marginBottom: "20px",
  marginTop: "10px",
  lineHeight: "28px",
};

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

const buttonStyle = {
  backgroundColor: `#FF5B5B`,
  borderRadius: "6px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  marginTop: "10px",
  marginBottom: "10px",
  padding: "14px 55px",
};

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
