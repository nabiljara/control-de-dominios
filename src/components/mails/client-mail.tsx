import {
  Body,
  Head,
  Html,
  Img,
  Text,
  Link,
  Section,
  Container,
  Font,
  Row,
  Column,
  Hr,
} from "@react-email/components";
interface ClientEmailProps {
  client: string;
  domain: string;
  days: string;
  expirationDate: string;
}

const baseUrl = process.env.SICOM_URL ? `https://${process.env.SICOM_URL}` : "";

export default function ClientEmail({
  client,
  domain,
  days,
  expirationDate,
}: ClientEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Manrope"
          fallbackFontFamily="Arial"
          webFont={{
            url: "https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={main}>
        <Container style={container}>
          <div style={subContainer}>
            <Section style={headerContainer}>
              <Row>
                <Column style={headerColumn}>
                  <Img
                    src={`https://kerneltech.dev/images/kernel-black.svg`}
                    alt="Kernel Logo"
                    height={41}
                    width={110}
                  />
                </Column>
                <Column style={headerColumn}>
                  <Text style={headerText}></Text>
                </Column>
              </Row>
            </Section>
            <Section style={content}>
              <Text style={textContent}>
                ¡Hola <strong style={bold}>{client}</strong>!
              </Text>
              <Text style={textContent}>
                Le informamos que el dominio asociado a su cuenta{" "}
                <strong style={bold}>{domain}</strong>{" "}
                <span style={{ textDecoration: "underline" }}>{days}</span>.
                Para evitar interrupciones en su servicio, le recomendamos
                ponerse en contacto con la administración de Kernel a la
                brevedad para gestionar su renovación.
              </Text>
              <Text style={textContent}>
                En caso de no realizar la renovación, el dominio expirará
                automáticamente en la fecha de vencimiento establecida (
                <strong style={bold}>{expirationDate}</strong>). Si necesita
                asistencia, no dude en comunicarse con nosotros.
              </Text>
            </Section>
            <Hr style={divider} />
            <Section>
              <Row>
                <Column align="left" style={{ paddingRight: "10px" }}>
                  <Text style={footerText}>
                    <strong style={boldInter}>Kernel SAS</strong>
                  </Text>
                  <Text style={footerText}>Tu partner Tecnológico</Text>
                </Column>
                <Column align="right">
                  <Row align="right">
                    <Column>
                      <Link
                        href="https://wathsapp.com"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Img
                          alt="WhatsApp"
                          height="20"
                          width="20"
                          src={`${baseUrl}/email/whatsapp.png`}
                          style={socialLink}
                        />
                      </Link>
                    </Column>
                    <Column>
                      <Link
                        href="https://www.instagram.com/kerneltechs/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        <Img
                          alt="Instagram"
                          height="20"
                          width="20"
                          src={`${baseUrl}/email/instagram.png`}
                          style={socialLink}
                        />
                      </Link>
                    </Column>
                  </Row>
                </Column>
              </Row>
            </Section>
          </div>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily: "Manrope, Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  width: "600px",
};
const subContainer = {
  padding: "8px",
};

const headerContainer = {
  background: "linear-gradient(to right, #7FC7B3, #4B529E, #7FC7B3)",
  borderRadius: "20px",
  marginBottom: "20px",
};

const headerColumn = {
  padding: "24px 32px",
};

const headerText = {
  color: "#FFFFFF",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
  textAlign: "right" as const,
};

const content = {
  margin: "0 0 25px",
};

const textContent = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "24px",
};
const divider = {
  borderColor: "#E1E1E1",
  margin: "0 0 24px",
};

const footerText = {
  color: "#1E1E1E",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 0",
  fontFamily: "Inter, Manrope, arial",
};

const socialLink = {
  marginLeft: 10,
  marginRight: 10,
};

const bold = {
  fontWeight: "bold",
};
const boldInter = {
  fontWeight: "bold",
  fontFamily: "Inter, Manrope, Arial",
};
