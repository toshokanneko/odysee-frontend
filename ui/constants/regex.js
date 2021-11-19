// ** URL PROTOCOLS ** //
export const URL_PROTOCOL = new RegExp('^(https?|lbry|mailto)+:', 'i');
export const EMAIL_PROTOCOL = new RegExp('^mailto:', 'i');
export const EMAIL = /^[^@]+@[^@]+$/;
export const PART_PROTOCOL = '^((?:lbry://)?)';

// ** WALLET ** //
export const WALLET_ADDRESS = /^(b|r)(?=[^0OIl]{32,33})[0-9A-Za-z]{32,33}$/;
export const VALID_IPADDRESS = new RegExp(
  '^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\\.)){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$'
);
export const VALID_HOSTNAME = new RegExp(
  '^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])(\\.))+([A-Za-z]|[A-Za-z][A-Za-z]*[A-Za-z])$'
);
export const VALID_PORT = new RegExp('^([0-9]){1,5}$');

// ** LBRY URI ** //
// see https://spec.lbry.com/#urls
export const INVALID_URI = /[ =&#:$@%?;/\\"<>%{}|^~[\]`\u{0000}-\u{0008}\u{000b}-\u{000c}\u{000e}-\u{001F}\u{D800}-\u{DFFF}\u{FFFE}-\u{FFFF}]/u;
export const URI = /(lbry:\/\/)[^\s"]*[^)]/g;
export const PART_STREAM_OR_CHANNEL_NAME = '([^:$#/]*)';
export const PART_MODIFIER_SEPARATOR = '([:$#]?)([^/]*)';
export const QUERY_STRING_BREAKER = '^([\\S]+)([?][\\S]*)';
export const SEPARATE_QUERY_STRING = new RegExp(QUERY_STRING_BREAKER);

// ** APP ** //
export const CHANNEL_MENTION = /@[^\s()"_.+=?!@$%^&*;,{}<>/\\]*/gm;
export const STICKER = /(<stkr>:[A-Z0-9_]+:<stkr>)/;
export const EMOTE = /:\+1:|:-1:|:[\w-]+:/;
