import { Button, ButtonProps } from '@chakra-ui/react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps
} from 'react-router-dom';
import { forwardRef } from 'react';
import type { Ref } from 'react';

type ButtonLinkProps = 
  Omit<ButtonProps, 'as'> & 
  Pick<RouterLinkProps, 'to' | 'replace' | 'state'>;

const ButtonWithRouterLink = forwardRef<HTMLAnchorElement, ButtonLinkProps>((
  props,
  ref
) => {
  return <Button
    as={RouterLink}
    ref={ref as unknown as Ref<HTMLButtonElement>}
    {...props}
  />;
});

ButtonWithRouterLink.displayName = 'ButtonWithRouterLink';

export { ButtonWithRouterLink as ButtonLink };