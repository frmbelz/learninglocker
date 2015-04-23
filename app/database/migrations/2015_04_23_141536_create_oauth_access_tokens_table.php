<?php

use Illuminate\Database\Schema\Blueprint;
use LucaDegasperi\OAuth2Server\Support\Migration;

class CreateOauthAccessTokensTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::connection('mysql')->create('oauth_access_tokens', function (Blueprint $table) {
            $table->string('id', 40);
            $table->primary('id');
            $table->integer('session_id')->unsigned();
            $table->integer('expire_time');

            $table->timestamps();

            $table->unique(['id', 'session_id']);
            $table->index('session_id');

            $table->foreign('session_id')
                  ->references('id')->on('oauth_sessions')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::connection('mysql')->table('oauth_access_tokens', function (Blueprint $table) {
            $table->dropForeign('oauth_access_tokens_session_id_foreign');
        });
        Schema::connection('mysql')->drop('oauth_access_tokens');
    }
}
