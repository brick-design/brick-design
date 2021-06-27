import {each} from 'lodash';

type SubjectType=()=>void
type SubjectsMapType={[key:string]:SubjectType}
export class BrickObserver{
	subjects:SubjectType[]=[]
	subjectsMap:SubjectsMapType={}
	addSubject=(newSubject:SubjectType|SubjectsMapType)=>{
		if(typeof newSubject==='function'){
			this.subjects.push(newSubject);
		}else {
			this.subjectsMap={...this.subjectsMap,...newSubject};
		}
	}
	executeSubject=()=>{
		this.subjects.forEach((v)=>v());
		this.subjects.length=0;
		each(this.subjectsMap,(v)=>v());
		this.subjectsMap={};
	}

	cleanSubject=()=>{
		this.subjects.length=0;
		this.subjectsMap={};
	}
}
