<?php
namespace Deployer;

require 'recipe/laravel.php';

// Project name
set('application', 'FUTUREBERRY');

// Project repository
set('repository', 'git@github.com:OutlawPlz/futureberry.com.git');

// [Optional] Allocate tty for git clone. Default value is false.
set('git_tty', true);

// Deploy to stage server by default.
set('default_stage', 'stage');

// Release name
set('release_name', function () {
    return runLocally('git rev-parse --verify --short=7 origin/master');
});

// Shared files/dirs between deploys
add('shared_files', []);
add('shared_dirs', [
    'themes/futureberry/content',
    'themes/futureberry/meta',
]);

// Writable dirs by web server
add('writable_dirs', ['themes']);

// Hosts
inventory('hosts.yaml');

//host('project.com')
//    ->set('deploy_path', '~/{{application}}');

// Tasks
task('october:up', function () {
    run('{{bin/php}} {{release_path}}/artisan october:up');
});

task('build', function () {
    run('cd {{release_path}} && build');
});

// [Optional] if deploy fails automatically unlock.
after('deploy:failed', 'deploy:unlock');

// Migrate database before symlink new release.
before('deploy:symlink', 'october:up');
