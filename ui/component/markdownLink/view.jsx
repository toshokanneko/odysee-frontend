// @flow
import { isURIValid } from 'util/lbryURI';
import { KNOWN_APP_DOMAINS } from 'config';
import * as ICONS from 'constants/icons';
import * as React from 'react';
import * as REGEX from 'constants/regex';
import Button from 'component/button';
import ClaimLink from 'component/claimLink';

type Props = {
  allowPreview?: boolean,
  children: React.Node,
  embed?: boolean,
  href: string,
  isMarkdownPost?: boolean,
  parentCommentId?: string,
  simpleLinks?: boolean,
  title?: string,
};

function MarkdownLink(props: Props) {
  const {
    allowPreview = false,
    children,
    embed = false,
    href,
    isMarkdownPost,
    parentCommentId,
    simpleLinks = false,
    title,
  } = props;

  let decodedUri;
  try {
    decodedUri = decodeURI(href);
  } catch (e) {}

  if (!href || !decodedUri) {
    return children || null;
  }

  let element = <span>{children}</span>;

  const protocol = href ? REGEX.URL_PROTOCOL.exec(href) : null;

  let linkUrlObject;
  try {
    linkUrlObject = new URL(decodedUri);
  } catch (e) {}

  let lbryUrlFromLink;
  if (linkUrlObject && !href.startsWith('mailto:')) {
    const linkDomain = linkUrlObject.host;
    const isKnownAppDomainLink = KNOWN_APP_DOMAINS.includes(linkDomain);
    if (isKnownAppDomainLink) {
      let linkPathname;
      try {
        // This could be anything
        linkPathname = decodeURIComponent(
          linkUrlObject.pathname.startsWith('//') ? linkUrlObject.pathname.slice(2) : linkUrlObject.pathname.slice(1)
        );
      } catch (e) {}

      const linkPathPlusHash = linkPathname ? `${linkPathname}${linkUrlObject.hash}` : undefined;
      const possibleLbryUrl = linkPathPlusHash ? `lbry://${linkPathPlusHash.replace(/:/g, '#')}` : undefined;

      const lbryLinkIsValid = possibleLbryUrl && isURIValid(possibleLbryUrl);
      const isMarkdownLinkWithLabel =
        children && Array.isArray(children) && React.Children.count(children) === 1 && children.toString() !== href;

      if (lbryLinkIsValid && !isMarkdownLinkWithLabel) {
        lbryUrlFromLink = possibleLbryUrl;
      }
    }
  }

  // Return timestamp link if it starts with '?t=' (only possible from remark-timestamp).
  // Return plain text if no valid url.
  // Return external link if protocol is http or https.
  // Return local link if protocol is lbry uri.
  if (href.startsWith('?t=')) {
    // Video timestamp markers
    element = (
      <Button
        button="link"
        iconRight={undefined}
        title={title || decodedUri}
        label={children}
        className="button--external-link"
        onClick={() => {
          if (window.player) {
            window.player.currentTime(parseInt(href.substr(3)));
            window.scrollTo(0, 0);
          }
        }}
      />
    );
  } else if (!simpleLinks && ((protocol && protocol[0] === 'lbry:' && isURIValid(decodedUri)) || lbryUrlFromLink)) {
    element = (
      <ClaimLink
        uri={lbryUrlFromLink || decodedUri}
        autoEmbed={embed}
        parentCommentId={parentCommentId}
        isMarkdownPost={isMarkdownPost}
        allowPreview={allowPreview}
      >
        {children}
      </ClaimLink>
    );
  } else if (
    simpleLinks ||
    (protocol && (protocol[0] === 'http:' || protocol[0] === 'https:' || protocol[0] === 'mailto:'))
  ) {
    const isLbryLink = href.startsWith('lbry://');

    element = (
      <Button
        button="link"
        iconRight={isLbryLink ? undefined : ICONS.EXTERNAL}
        title={title || decodedUri}
        label={children}
        className="button--external-link"
        navigate={isLbryLink ? href : undefined}
        href={isLbryLink ? undefined : href}
      />
    );
  }

  return <>{element}</>;
}

export default MarkdownLink;
