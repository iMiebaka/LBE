import { Request } from "express";
import {ITQuestionData, ITAddQuestionData} from "./Platform"

interface AddReactionParams extends Request {
    id?: string;
    reaction?: number;
}



export { AddReactionParams, ITQuestionData,ITAddQuestionData }