import { Request, Response } from 'express';

type UrlParams = Record<string, string>;

export type Req = Request<UrlParams, void, Record<string, unknown>>;
export type Res = Response;
