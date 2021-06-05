export function splitIntArray(str: string): number[] {
  return str.split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0)
    .map(s => parseInt(s, 10));
}

export function splitStringArray(str: string): string[] {
  return str.split(',')
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

interface NameObject {
  firstName?: string | null;
  lastName?: string | null;
  email: string;
}

export const nameStringOrEmail = ({ firstName, lastName, email }: NameObject) => {
  return firstName && lastName ? `${firstName} ${lastName}`
    : firstName ? firstName
      : lastName ? lastName
        : email;
}

export function addProtocolToLink(link: string): string {
  const startsWithProtocol = link.startsWith(`http://`) || link.startsWith(`https://`);
  return startsWithProtocol
    ? link
    : `https://${link}`
}