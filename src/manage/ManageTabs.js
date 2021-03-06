import React from 'react';
import { ManagePlanet } from './ManagePlanet';
import './ManageTabs.css';
import { FactoryTabs } from './factory/FactoryTabs';
import { ManageStorage } from './ManageStorage';
import {ManageSystem} from "./ManageSystem";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Tabs} from "react-bootstrap";
import {ManageLog} from "./ManageLog";

export function ManageTabs() {

  return (
    <Tabs defaultActiveKey='planet' id='manage-tabs' mountOnEnter unmountOnExit className="flex-nowrap">
      <Tab eventKey='planet' title='Planet'>
        <ManagePlanet/>
      </Tab>

      <Tab eventKey='factory' title='Factory'>
        <FactoryTabs/>
      </Tab>

      <Tab eventKey='storage' title='Storage'>
        <ManageStorage/>
      </Tab>

      <Tab eventKey='log' title='Log'>
        <ManageLog/>
      </Tab>

      <Tab eventKey='system' title='System'>
        <ManageSystem/>
      </Tab>
    </Tabs>);
}

