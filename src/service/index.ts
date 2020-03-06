import { message } from 'antd';

let db: any;
export const initDB = (dbName: string, dbTable: string, dbTableConfig: any, tableIndexs: any, version?: number) => {
  let dbRequest = window.indexedDB.open(dbName, version);
  dbRequest.onupgradeneeded = (event: any) => {
    db = event.target.result;
    if (dbTable && !db.objectStoreNames.contains(dbTable)) {
      let objectStore = db.createObjectStore(dbTable, dbTableConfig);
      for (let { name, keyPath, options } of tableIndexs) {
        objectStore.createIndex(name, keyPath, options);
      }
    }
  };
  dbRequest.onsuccess = () => {
    db = dbRequest.result;
  };
};

export const addTemplates = (payload: any, resolve: any) => {
  const { img, name, config } = payload;
  const addRequest = db.transaction(['templates'], 'readwrite')
    .objectStore('templates')
    .add({ img, name, config });
  addRequest.onsuccess = () => {
    resolve();
    message.success('模板数据保存成功！');
  };
};

export const getTemplates = (resolve: any) => {
  const getRequest = db.transaction(['templates'], 'readonly')
    .objectStore('templates')
    .openCursor(null, 'next');
  let templateInfos: any[] = [];
  getRequest.onsuccess = (event: any) => {
    let cursor = event.target.result;
    if (cursor) {
      templateInfos.push({ id: cursor.key, ...cursor.value });
      cursor.continue();
    } else {
      resolve(templateInfos);
    }
  };

};


export const deleteTemplate = (id: string, resolve: any) => {
  const deleteRequest = db.transaction(['templates'], 'readwrite')
    .objectStore('templates')
    .delete(id);
  deleteRequest.onsuccess = () => {
    resolve();
    message.success('模板删除成功！');
  };


};

export const searchTemplate = (value: string, resolve: any) => {
  const searchRequest = db.transaction(['templates'], 'readonly')
    .objectStore('templates')
    .index('name')
    .get(value);

  searchRequest.onsuccess = (event: any) => {
    resolve(event.target.result);
  };

};
