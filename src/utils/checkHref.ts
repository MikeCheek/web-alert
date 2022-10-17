import { LOCATION } from './constants';

const checkHref = () => {
  if (window.location.href.includes(LOCATION.FACEBOOK)) return LOCATION.FACEBOOK;
  if (window.location.href.includes(LOCATION.FACEBOOK_MOBILE)) return LOCATION.FACEBOOK_MOBILE;
  return LOCATION.ANY;
};

export default checkHref;
