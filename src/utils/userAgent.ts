import { Request } from "express";
import { UserAgent } from "express-useragent";
import { UserAgent as UserAgentInterface } from "@/interfaces/common/useragent.interface";

export const getUserAgent = (req: Request): UserAgentInterface => {
  const userAgent = new UserAgent().parse(req.headers["user-agent"] as string);

  // const parsedUseragent = Object.entries(userAgent).reduce((obj, [key, value]) => {
  //   if (typeof value == "string" && value.length !== 0) obj[key] = value;
  //   return obj;
  // }, {});

  const userAgentPayload: UserAgentInterface = {
    browser: userAgent.browser,
    version: userAgent.version,
    os: userAgent.os,
    platform: userAgent.platform,
    ip_address:
      req.clientIp?.replace("::ffff:", "") ||
      req.socket.remoteAddress ||
      req.connection.remoteAddress ||
      req.headers["x-forwarded-for"] as string,
    referrer: req.headers.referer,
    source: userAgent.source,
  };

  return userAgentPayload;
};