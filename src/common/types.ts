import { Request, Response } from 'express';

export interface Entity {
  id: number;
  created_at: Date;
  updated_at: Date;
}

type UrlParams = Record<string, string>;

export type Req = Request<UrlParams, void, Record<string, unknown>>;
export type Res = Response;
