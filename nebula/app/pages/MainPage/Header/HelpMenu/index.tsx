import React, { useContext } from 'react';
import { Menu } from 'antd';
import intl from 'react-intl-universal';
import Icon from '@app/components/Icon';
import { Link } from 'react-router-dom';
import Avatar from '@app/components/Avatar';
import { LanguageContext } from '@app/context';
import { INTL_LOCALE_SELECT } from '@app/config';
import { observer } from 'mobx-react-lite';
import { useStore } from '@app/stores';
import styles from './index.module.less';

const HelpMenu = () => {
  const { toggleLanguage } = useContext(LanguageContext);
  const { global: { username, logout, version } } = useStore();
  return <Menu
    className={styles.helpMenu}
    mode="horizontal"
    theme="dark"
    selectedKeys={[]}
  >
    <Menu.Item key="star">
      <a
        className={styles.nebulaLink}
        href="https://github.com/vesoft-inc/nebula"
        target="_blank"
        data-track-category="navigation"
        data-track-action="star_nebula"
        data-track-label="from_navigation" rel="noreferrer">
        <Icon className={styles.navIcon} type="icon-studio-nav-github" />
      </a>
    </Menu.Item>
    <Menu.SubMenu 
      key="language"
      popupClassName={styles.langMenu}
      popupOffset={[-35, 20]} 
      title={<Icon className={styles.navIcon} type="icon-studio-nav-language" />}> 
      {Object.keys(INTL_LOCALE_SELECT).map(locale => {
        return (
          <Menu.Item key={`language-${locale}`} onClick={() => toggleLanguage(INTL_LOCALE_SELECT[locale].NAME)}>
            {INTL_LOCALE_SELECT[locale].TEXT}
          </Menu.Item>
        );
      })}
    </Menu.SubMenu>
    <Menu.Item key="doc">
      <Link className={styles.nebulaLink} to="/doc">
        <Icon className={styles.navIcon} type="icon-studio-nav-help" />
      </Link>
    </Menu.Item>
    <Menu.SubMenu 
      key="user"
      popupClassName={styles.accountMenu}
      popupOffset={[-35, 20]}
      title={<div>
        <Avatar size="small" username={username}/>
      </div>}>
      <Menu.Item key="version-log">
        <a
          className={styles.nebulaLink}
          data-track-category="navigation"
          data-track-action="view_changelog"
          href={intl.get('link.versionLogHref')}
          target="_blank" rel="noreferrer"
        >
          <Icon className={styles.menuIcon} type="icon-studio-nav-version" />
          {intl.get('menu.release')}
        </a>
      </Menu.Item>
      <Menu.Item key="user-logout">
        <span className={styles.nebulaLink} onClick={logout}>
          <Icon className={styles.menuIcon} type="icon-studio-nav-clear" />
          {intl.get('configServer.clear')}
        </span>
      </Menu.Item>
      <Menu.Item key="version">
        v{version}
      </Menu.Item>
    </Menu.SubMenu>
  </Menu>;
};

export default observer(HelpMenu);
